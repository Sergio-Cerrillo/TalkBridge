let userEmail = '';

export const setUserData = (email) => {
  userEmail = email;
 
};

export const getUserData = () => ({
  email: userEmail,

});
