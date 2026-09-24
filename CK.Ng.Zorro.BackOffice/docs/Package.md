The shell of a back-office application: a layout with a sidebar, a top bar and a mobile bar, the
content frame that goes inside it, and a search modal the sidebar opens.

Reference the package, require `ZorroBackOfficePackage`, then put `<ck-backoffice-layout>` in your
shell with the router outlet as its content and wrap each page in `<ck-backoffice-layout-content>`.
No provider, no route.

Unlike the components it builds on, none of these six is optional: referencing the package generates
all of them. Its stylesheet is global - it restyles every ng-zorro button, modal panel and tab pane
of the application.
