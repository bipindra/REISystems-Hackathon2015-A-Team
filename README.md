# REISystems-Hackathon2015-A-Team

###About MortgageLender-Review.com

####Design Approach

The MortgageLender-Review.com application utlitizes the Consumer Financial Protection Bureau’s (CFPB) publicly available - Home Mortgage Disclosure Act (HMDA) data. The CFPB's Open Tech website provides the API to obtain the JSON source of the HMDA dataset.
The MortgageLender.com application is mostly built as a Client side application utlizing web service to query the HMDA dataset. The application also uses the open source version of ASP.net. 

####Development Approach
The team used GitHub version control and Trello boards for the agile planning, Visual Studio online for continous integration and deployment, Azure for hosting, Jasmine and karma for javascript unit test and Gulp for running tasks like build,clean, minification and starting the web server. The application is developed using the AngularJS on client side and ASP.Net on the server side. 
This is a single page application and all the calls are made to the web service directly to get the data. There is no data stored in our server or manipulated anything from server side. Entire application logic is written in client side angular js. 
We used angular charts to generate charts and graphs. This used d3j javascript library to render the charts. We used bootstrap for making our application responsive. The charts and graphs generated by angular charts are svg based and are responsive. 



####Build Instructions

PreRequisites
1. Install npm
2. Install git
3. Install .Net framework open source 1.0.0-beta5 https://github.com/dotnet/roslyn 

#####Build Instructions:

If building from command line 
1. Clone source code from github git clone https://github.com/REI-Systems/REISystems-Hackathon2015-A-Team
2. go to folder src/WebApp
3. run command dnu build 
4. npm install
5. bower install
6. dnx web or just run gulp

If opening from Visual Studio 2015
Open ATeam.sln 
Build the Solution
Run the solution using F5 or Run Button




####Contact information 

