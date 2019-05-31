# MeetingPlanner

Design is made using bootstrap4 from scratch for both small screen and desktop.

USER MANAGEMENT PART:

1) In signup part,I gave client side validation part so that user not only get error after submitting the form but also in real time.

2) It has countries list which i have given in ascending order for user ease. Once country is selected, country code automatically comes 
for mobile number field.

3) Field validation is done on client side as well as server side.

4) In both login and signup part, selection of user type is given (user or admin).

5) In signup part, on selecting admin as user type, username validation is done as admin ( it should be like anchal-admin).

6) Once user signup,mail has been sent to user for email confirmation.Before email confirmation, user can't login.

7) Go to mail for verifying yourself,once go to link which is provided in mail, user gets verified.

8) Now user can login with his credentials.

9) User can also reset his/her password.On clicking on reset password, mail has been sent for resetting password process.Once go to link
provided in mail, user go the page where he/she can set his new password.

10) This way user can reset his password and can login with his/her new credentials.

11) If user is logged in, then it directly goes to his/her dashboard (he/she can't come to login/signup page). 

12) It has also 404 and 500 server error page based upon response from backend it goes there.


Meetings Management part:

   ADMIN SECTION:

1) Admin dashboard contains all normal users list with his/her online status.

2) It also contains the meetings of admin with week,month,day view (it is also have different design pattern for overlapping meetings).

3) On clicking normal user, it goes to normal user calendar where all his/her meeting listed with each view(like admin dashboard).

4) There admin can find edit,delete, create icons.

5) On clicking on create icon, admin will go to meeting details form where meeting info have to enter. The fields are validated in real time.

6) If meeting start is less than meeting end date i.e. if admin is giving invalid date then he will be notified in real time.

7) when meeting is going to start within 15 minutes then remainder mail will be given to admin.

8) Before 5 minutes of meeting, alert modal will also come which admin can snooze or dismiss.

  NORMAL SECTION:

1) Normal dashboard contains the meetings of user with week,month,day view (it is also have different design pattern for overlapping meetings).

2) when meeting is going to start within 15 minutes then remainder mail will be given to user.

3) Before 5 minutes of meeting, alert modal will also come which user can snooze or dismiss.



Screenshots:

![meeting2](https://user-images.githubusercontent.com/32920850/42731137-a162d4f4-8824-11e8-924c-795577d8f177.png)
![meeting1](https://user-images.githubusercontent.com/32920850/42731139-a6fd763a-8824-11e8-9491-ae76d5722e5b.png)




