/// STARTING APPLICATION ///

1. Run npm install

2. Connect to Database

pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start

3. Start Local Host

DEBUG=myapp:* npm start


/// POST REQUESTS ///

In the form please specify enctype as "application/x-www-form-urlencoded"

EXAMPLE
<form action="demo_post_enctype.asp" method="post" enctype="multipart/form-data">
  First name: <input type="text" name="fname"><br>
  Last name: <input type="text" name="lname"><br>
  <input type="submit" value="Submit">
</form>