# REISystems-Hackathon2015-A-Team

###About MortgageLender-Review.com

####Design Approach

The MortgageLender-Review.com application utlitizes the Consumer Financial Protection Bureau’s (CFPB) publicly available - Home Mortgage Disclosure Act (HMDA) data. The CFPB's Open Tech website provides the API to obtain the JSON source of the HMDA dataset.
The MortgageLender.com application is mostly built as a Client side application utlizing web service to query the HMDA dataset. The application also uses the open source version of ASP.net. 

####Development Approach
The team used GitHub version control and Trello boards for the agile planning, Visual Studio online for continous integration and deployment, Azure for hosting, Jasmine and karma for javascript unit test and Gulp for running tasks like build,clean, minification and starting the web server. The application is developed using the AngularJS on client side and ASP.Net on the server side. 

The application is designed as a single page application. The data for the query and analysis is obtained using the web service to directly get the data. None of the data is stored on the server side. The client side application login follows the Angular js.

The application uses the Angular JS charts to generate the charts and graphs for analysis. The d3j javascript library is used to render the charts. Additionally, the application is made responsive by using Bootstrap. Additionally, the charts and graphs generated by the Angular js charts are svg based and are also responsive. 



####Build Instructions

#####PreRequisites
1. Install NPM
2. Install Github
3. Install the .Net framework open source 1.0.0-beta5. Refer https://github.com/dotnet/roslyn 

#####Build Instructions:

######If building from command line 
1. first clone the source code from Github using git clone https://github.com/REI-Systems/REISystems-Hackathon2015-A-Team
2. Go to the folder src/WebApp
3. Run command - dnu build 
4. Run command - npm install
5. Run command - bower install
6. Run command - dnx web or GULP

######If opening from Visual Studio 2015
1. Open ATeam.sln 
2. Build the Solution
3. Run the solution using F5 or Run Button

####Contact information 
1. Bipindra Shreshta
    
    Phone:409-225-8714
    Email: bshrestha@reisystems.com

(2) Ateet Vora
    
    Phone:571-229-2784
    Email:avora@reisystems.com

(3) Prasad Pai
    
    Phone:201-920-1512
    Email:prasad.pai@reisystems.com

(4) Scott Keeler
    
    Phone:703-480-9203
    Email:scott.keeler@reisystems.com

(5) Yashesh Shah

    Phone: 571-721-9141
    Email - yshah@reisystems.com
