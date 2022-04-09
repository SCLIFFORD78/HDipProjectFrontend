
import axios from "axios";
import {user} from "../stores";

export class HiveTracker {
  hiveList = [];
  alarmList = [];
  commentsList = [];
  selectedHive = [];
  baseUrl = "";

  

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    if (localStorage.hive) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.hive);
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, {email, password});
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      if (response.data.success) {
        user.set({
          email: email,
          token: response.data.token
        });
      localStorage.hive = JSON.stringify(response.data.token);
      return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async logout() {
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/logout`);
    } catch (error) {
      console.log(error)
    }
    user.set({
      email: "",
      token: ""
    });
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.hive = null;
  }

  async signup(firstName, lastName, email, password) {
    try {
      const userDetails = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      };
      const response = await axios.post(this.baseUrl + "/api/users", userDetails);
      const newUser = await response.data;
      user.set(newUser);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUserByEmail(email) {
    try {
      var headers = {'headers': {
        'Content-Type': 'text/plain', 
        'Authorization': 'Bearer '+JSON.parse(localStorage.hive)}
        };
      console.log(headers);
      //axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.hive);
      const response = await axios(`${this.baseUrl}/api/users/findByEmail/` + email)
      return response;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users", newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async update(firstName, lastName, email, password, id) {
    const details = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }
    try {
      const response = await axios.put(this.baseUrl + "/api/users/" + id, details);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return e;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users/" + id);
      return response;
    } catch (e) {
      return null;
    }
  }

  async toggleAdmin(id){
    try {
      const response = await axios.put(this.baseUrl + "/api/users/toggleAdmin/" + id)
      return response.statusText;
    } catch (error) {
      return error
    }
  }

  async getHives() {
    try {
      const response = await axios.get(this.baseUrl + "/api/hives");
      this.hiveList = response.data;
      return this.hiveList;
    } catch (error) {
      return [];
    }
  }

  async getHive(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/hives/" + id);
      this.selectedHive = [];
      if (this.selectedHive.length == 0){
        this.selectedHive.push(response.data);
      }
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getHiveByOwner(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/hives/getHiveByOwner/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createHive(latitude, longtitude, hiveType, description, comments , owner ) {

    const newHive = {
      latitude: latitude,
      longtitude: longtitude,
      hiveType: hiveType,
      description: description,
      details: {comments: comments},
      owner: owner

    }
    try {
      const response = await axios.post(this.baseUrl + "/api/hives", newHive);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllHives() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/hives");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneHive(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/hives/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getHiveComments(fbid) {
    try {
      const response = await axios.get(this.baseUrl + "/api/hives/hive/comments/"+fbid);
      this.commentsList = response.data;
      return this.commentsList;
    } catch (error) {
      return [];
    }
  }

  async addHiveComment(comment, id, userid) {

    const details = {
      _id: id,
      comment: comment,
      userid: userid
    }
    try {
      const response = await axios.post(this.baseUrl + "/api/hives/addComment", details);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteHiveComment(comment_id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/hives/deleteComment/" + comment_id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async updateLocation(id, latitude, longtitude) {

    const location = {
      id: id,
      latitude: latitude,
      longtitude: longtitude
    };
    try {
      const response = await axios.put(this.baseUrl + "/api/hives/updateLocation", location);
      const response2 = await axios.get(this.baseUrl + "/api/hives/" + id);
      return response.data;
      return response2.data;
      this.selectedHive = response2.data
    } catch (e) {
      return null;
    }
  }

  async getWeather(latitude, longtitude) {

    const location = {
      latitude: latitude,
      longtitude: longtitude
    }
    try {

      const response = await axios.post(this.baseUrl + "/api/hives/getWeather", location);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async readWeatherHistory(hiveID) {
    const fbid = {fbid:hiveID}
    try {

      const response = await axios.post(this.baseUrl + "/api/hives/readWeatherHistory", fbid);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async gallery(id) {
    try {

      const response = await axios.get(this.baseUrl + "/api/hives/gallery/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteImage(id) {
    try {
      console.log(id);
      const response = await axios.delete(this.baseUrl + "/api/hives/deleteImage/" + id) ;
      return response.data;
    } catch (e) {
      return null;
    }
  }



  async authenticate(user) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users/authenticate", user);
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async clearAuth(user) {
    axios.defaults.headers.common["Authorization"] = "";
  }

  async getHiveAlarms(fbid) {
    try {
      const response = await axios.get(this.baseUrl + "/api/hives/hive/alarms/"+fbid);
      this.alarmList = response.data;
      return this.alarmList;
    } catch (error) {
      return [];
    }
  }

  async ackAlarm(fbid) {
    const payload = {fbid:fbid}
    try {
      const response = await axios.post(this.baseUrl + "/api/hives/hive/ackalarm", payload);
      return response.data;
    } catch (e) {
      return null;
    }
  }


}

