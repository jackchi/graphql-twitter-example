const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');
const bcrypt = require('bcrypt')

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * Creates a User with email and password if it doesn't exist.
   */
  async register({email: emailArg, password: passwordArg} =  {}) {
    // find if user exists
    if (!emailArg || !isEmail.validate(emailArg)) return {
      success: false,
      message: "Email invalid format.",
      email: emailArg
    };
    const user_count = await this.store.users.count({
      where: {email: emailArg}
    });

    if (user_count){
      return {
        success: false,
        message: "Email already taken.",
        email: emailArg  
      }
    } else{
      // store the bcrypt password hash
      let hash = bcrypt.hashSync(passwordArg, 10);
      const users = await this.store.users.findOrCreate({ where: { email: emailArg, password: hash } });
      const user = users[0];
      return {
        success: emailArg == user.dataValues.email,
        message: "User Created",
        email: user.dataValues.email,
      }
    }
  }

  /**
   * Logins with email and password. Returns the token to be used in HTTP Authorization Header.
   */
  async login({ email: emailArg, password: passwordArg} = {}) {
    // find account by email
    const user = await this.store.users.findOne({
      where : { email: emailArg } 
    });

    if(user == null) return {
      success: false,
      message: emailArg + " not found!"
    };
    
    // checks for password
    if(bcrypt.compareSync(passwordArg, user.dataValues.password)) {
      // Passwords match
      return { 
        success: true,
        message: "Logged in!",
        token: user.dataValues.password
      }
     } else {
      return {
        success: false,
        message: "Wrong Password Error"
      }
     }
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findUser({ token: tokenArg } = {}) {
    const token =
      this.context && this.context.user ? this.context.user.password : tokenArg;
    const user = await this.store.users.findOne({
      where: {
        password: token
      }
    });
    return user;
  }

  async createPost( { message } ) {
    const userId = this.context.user.id;
    const res = await this.store.posts.create({
      userId: userId,
      message: message,
    });
    return res ? res.dataValues : false;  
  }

  /**
   * Helper function to make Posts more human-readable.
   * @param {*} post 
   */
  postReducer(post) {
    const friendlyPost = {
      id: post.dataValues.id,
      userId: post.dataValues.userId,
      message: post.dataValues.message,
      createdAt: this.epoch_to_human_readable(post.dataValues.createdAt),
      updatedAt: this.epoch_to_human_readable(post.dataValues.updatedAt),
    };
    return friendlyPost
  }

  epoch_to_human_readable(epoch_date) {
    var myDate = new Date(epoch_date);
    return myDate.toLocaleString(); 
  }
  
  async posts() {
    const userId = this.context.user.id;
    const res = await this.store.posts.findAndCountAll({
      where: {userId : userId },
    });
    
    const posts = Array.isArray(res.rows) ? res.rows.map(post => this.postReducer(post)) : [];
    
    return {
      count: res.count,
      posts: posts,
    };
  }

  async bookTrip({ launchId }) {
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser() {
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId, launchId },
    });
    return found && found.length > 0;
  }
}

module.exports = UserAPI;
