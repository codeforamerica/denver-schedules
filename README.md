Denver Street Sweeping API
=====================

[![Build Status][build_png]][travis]

[build_png]: https://travis-ci.org/codeforamerica/denver-schedules.png?branch=master
[travis]: https://travis-ci.org/codeforamerica/denver-schedules

*Current Status*: As of October 2014 Denver Street Sweeping is available on [http://streetsweep.co/][ss] as a pilot project for the City and County of Denver. 

* [What is Denver Street Sweeping](#what-is-denver-street-sweeping)
* [Technical details and developer documentation](#technical-details)
* [License](#license)

This is the repo for Denver Street Sweeping's client code. If you're looking for the backend API code, [visit this repo][api].

[ss]: http://streetsweep.co
[api]: https://github.com/codeforamerica/denver-schedules-api

##What Is Denver Street Sweeping?

Denver Street Sweeping is a web application developed by the 2014 Code for America Fellows in Denver. The app uses street sweeping data from the City and County of Denver. It allows residents of Denver to lookup an address and find the corresponding street sweeping schedule for that address. The resident can then sign up for schedule reminders by Email or SMS. The web app is responsive.

[Read more about Denver Street Sweeping here](/docs/about.md)


##Technical Details

The Denver Street Sweeping client reads and parses data from the API and presents it on screen.

**Languages**: Javascript, HTML, CSS

### Platform pieces
* [Bootstrap 3.1.1][bootstrap] is used as the frontend HTML/CSS/JS framework.

[bootstrap]: http://getbootstrap.com/

### Libraries
* [jQuery][jquery] is a Javascript library.
* [Font Awesome 4.0.3][fontawesome] is used to render many of the icons on the site.
* [handlebars][handlebars] is used to format and represent data from the API on the front end.

[jquery]: http://jquery.com/
[fontawesome]: http://fortawesome.github.io/Font-Awesome
[handlebars]: http://handlebarsjs.com/

### Code

Denver Street Sweeping is composed of an [API backend][api] and a [client front end][client]. The API reads the data. The front end takes data from the API, formats it, and serves up the website. 

* [Continuous Integration][travis] (Travis)
* [Staging][staging] 
* [Production][prod]

[client]: https://github.com/codeforamerica/denver-schedules
[prod]:  http://streetsweep.co/
[staging]: http://staging.streetsweep.co/

### Installation, Usage

Use python's simple server to run the code:

``` bash
python -m SimpleHTTPServer 8000
```

### Submitting an Issue
We use the GitHub issue tracker to track bugs and features. Before submitting a bug report or feature request, check to make sure it hasn't already been submitted. When submitting a bug report, please include a [Gist][] that includes a stack trace and any details that may be necessary to reproduce the bug.

[gist]: https://gist.github.com/

### Submitting a Pull Request
1. [Fork the repository.][fork]
2. [Create a topic branch.][branch]
3. [Submit a pull request.][pr]

[fork]: http://help.github.com/fork-a-repo/
[branch]: http://learn.github.com/p/branching.html
[pr]: http://help.github.com/send-pull-requests/

##License
See the [LICENSE][] for details.

[license]: https://github.com/codeforamerica/denver-schedules/blob/master/LICENSE



