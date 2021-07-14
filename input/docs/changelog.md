title: The StellarAdmin changelog
nav-title: Changelog
order: 12
---

## v0.25.0

* Added a NumberEditor for currency and other number inputs
* Enhancements to the DateEditor and DateTimeEditor
* Enhancements to the MarkdownEditor 
* Various smaller bugfixes

## v0.24.0

* Various UI updates
* Renamed `ResourceDefinitionBuilder<TResource>.AddPanel()` to `ResourceDefinitionBuilder<TResource>.AddSection()`

## v0.23.0

* Removed the dependency on the Static File Middleware. If you had to add a call to `UseStaticFiles()` in your `Startup.Configure` method just for StellarAdmin, feel free to remove it.
* Fixed issues with referenced resources on EF Core data sources.
* Better support for referenced resources on non-EF Core data sources.
* Apply resource permissions correctly on the front-end
* Allow specifying default values for fields
* Added a new [Blog Sample](https://github.com/stellar-admin/samples)

## v0.20.0

Version 0.20.0 denotes a major change in the underlying architecture for StellarAdmin. One of the major reasons for this was that we wanted to make it more flexible regarding where you resource definition are defined. We want to get to a point where you can just point to your `DbContext` and StellarAdmin will determine the resources from the entity classes managed by the `DbContext`. It also leaves open the possibility to define resources in external sources such as a database or, dare we say it, a YAML file.

Another major change was to decouple the reading and writing of resources from your underlying data store from the actual entity definition. We now have the concept of a data source which acts as a gateway between your resource and the underlying data store.

Due to these major changes, it would be impractical to give any sort of migration guide. However, here are some of the highlights of the major changes with links to the documentation that will explain how to use it in your current application.

1. You no longer define resources by inheriting from `ResourceDefinition<T>`. You now [define resources](resources) using the new `StellarAdminBuilder`.
1. Reading and writing data from your data store has been moved to [data sources](datasources). If you use Entity Framework core, you can [use the new DbContextDataSource](datasources#using-the-dbcontextdatasource). If you have a custom data source you can [use the new DelegateDataSource](datasources#using-the-delegatedatasource).
1. You now [define fields](fields) using the new `ResourceDefinitionBuilder`.
1. For actions, you need to inherit from one of the new base classes, then register the action with your resource [using the ResourceDefinitionBuilder](actions).

Our apologies for making you go through all these changes, but we do believe that it will lead to a better product in the end. Hopefully we can minimize major changes like this going forward.