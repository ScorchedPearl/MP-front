import axios from "axios";

export const currentUserFetcher = async () => {
 try {
   const token="Bearer "+localStorage.getItem('__Pearl_Token') || '';
   console.log(token)
   const user = await axios.get("http://localhost:8080/api/v1/users/current-user", {
     headers: {
       Authorization: token,
     },
   });
   if (user.status === 200) {
     return user.data;
   } else {
     console.log("Error fetching user data");
   }
 } catch (error) {
   console.error("Error fetching user data:", error);
 }
};





