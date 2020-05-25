Basic set up of the meet structure so far.
To get up and running quickly this is how its done for a new person.
add a forename.lastname.html file to the meet folder
in that file paste the following structure

<html>
    <head>
        <script src="meetLoader.js"></script>
    </head>
    <body></body>
</html>

Then in the meet/people/ folder add a new folder with the name of: forename.lastname
in that folder add an forename.lastname.xml file with the following structure

<meet>
    <name>The name of the person</name>
    <bio>
        The text you want to show. This text will be shown exactly as indented row breaked etc
        This hopefully makes it easier for you to just copy paste from word etc 
        and then be done with it
    </bio>   
    <photos>image_name.jpg
        <photo>image_name.jpg</photo>
        <photo>image2_name.png</photo>
        ...
    </photos>

</meet>

Of course you need to add the image in jpg format as well to the folder.


NOTE: 
This is a quick bare bones set up to get up and running.
A great improvement would be to make the .htaccess script in the meet folder 
be able to redirect to a shared meet.html page which would run the meetLoader.js file
This way we would be able to skip the individual name.html files and just upload content
into the personal folders. (But as of yet I have not been able to get that to work).