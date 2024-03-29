title: Changelog
---

## v0.28.0

* Added breadcrumbs to the various resource pages, which is especially useful for the new master-detail view as you could lose the context of which master resource you are viewing.
* Renamed the `HasDisplay()` method of the resource builder to `HasTitle()`.

## v0.27.0

* Support for master-detail relationships with Collections
* Allow deleting resources from the resource detail page
* Allow rapidly adding resources with the new "Save and Add Another" button
* Renamed the `*ResourceAction` base classes
    - `SimpleResourceAction` -> `SimpleResourceActionHandler`
    - `ConfirmationResourceAction` -> `ConfirmationResourceActionHandler`
    - `FormResourceAction<>` -> `FormResourceActionHandler<>`
* Renamed the various `Add*Action` methods of the resource builder
    - `AddSimpleAction<>` -> `AddAction<>`
    - `AddConfirmationAction<>` -> `AddAction<>`
    - `AddFormAction<,>` -> `AddAction<,>`
* Various namespace changes

## v0.26.0

* [Resource segments](/docs/concepts/filtering/segments) allow users to view subsets of resources. 
* The ability to delete a resource from the resource detail page.
* A new "Save and Add Another" button on resource creation screens allow users to add multiple resources rapidly.
* `DbContextDataSourceOptions<TResource>.ApplyFilter` has been renamed to `ApplyFilters` and now takes a `ResourceFilter` instance instead of a simple string with the search term. The search term is available in `ResourceFilter.SearchTerm`.

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
* Resource permissions are applied correctly on the front-end
* Allow specifying default values for fields
* Added a new [Blog Sample](https://github.com/stellar-admin/samples)

## v0.20.0

Version 0.20.0 denotes a significant change in the underlying architecture for StellarAdmin. One of the primary reasons for this was that we wanted to make it more flexible regarding where you resource definition are defined. We want to get to a point where you can point to your `DbContext`, and StellarAdmin will determine the resources from the entity classes managed by the `DbContext`. It also leaves open the possibility to define resources in external sources such as a database or, dare we say it, a YAML file.

Another significant change was to decouple the reading and writing of resources from your underlying data store from the actual entity definition. We now have the concept of a data source that acts as a gateway between your resource and the underlying data store.

Due to these changes, it would be impractical to give any a migration guide. However, here are some of the highlights of the major changes with links to the documentation that will explain how to use it in your current application.

1. You no longer define resources by inheriting from `ResourceDefinition<T>`. You now [define resources](xref:define-resources) using the new `StellarAdminBuilder`.
1. Moved reading and writing data from your data store has to [data sources](xref:datasources-overview). If you use Entity Framework core, you can [use the new DbContextDataSource](xref:datasources-overview#using-the-dbcontextdatasource). If you have a custom data source you can [use the new DelegateDataSource](xref:datasources-overview#using-the-delegatedatasource).
1. You now [define fields](xref:fields-overview) using the new `ResourceDefinitionBuilder`.
1. For actions, you must inherit from one of the new base classes, then register the action with your resource [using the ResourceDefinitionBuilder](xref:actions-intro).

Our apologies for making you go through all these changes, but we do believe that it will lead to a better product in the end. Hopefully, we can minimize breaking changes like this in the future.