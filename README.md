<div align="center">
    <h1>Julien Lopez's 2Leaf Assessment Project</h1>
    <img src='./assets/2Leaf_Logo.svg'/>
</div>
</br>
</br>
Hi! First and foremost, I would like to say thank you all so much for taking a chance on me!
</br>
I hope this project is a true representation of my skill as a developer. I tried to hit every mark on
the prompt and worked very hard for it to look pretty, so please let me know how I did!

Thank you,
Julien

## Installing dependencies

To run the app, please clone, download, and install the package dependencies (nodemon node and express).
</br>
(I think this is correct, I've never instructed anyone on how to download and run my apps locally)

    > git clone https://github.com/juuuuurien/assessment-julien-lopez.git
    > npm install

## Running Express Server

To serve some backend code, I chose Node.js and Express, with nodemon for auto save refreshes. To run the local server run:

    > npm start

in your terminal. This will run the express server to http://localhost:8080/

## "Logging in" via Modal

The way I setup auth was to pass the password straight into a cookie, passing that over to the server, and validating it there.
<br />
Obviously, in a real world app, I would probably use a jwt, or OAuth instead.
<br />
<br />
The "/parentportal" route is also protected, so that unauthorized users cannot navigate to the page via editing the page url.

<br />

<pre>
<code>
> To Sign in via the Modal. Enter: "<font size="4"><strong >HireMe123</strong></font>" into the text field.
> Click the Parent Portal button
</code>
</pre>

## Testing the Database

I decided to use MongoDB as the database to store user emails.
<br />
To checkout all emails in the database, visit:

    > http://localhost:8080/api/subscribe
