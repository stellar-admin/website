title: Defining the data source for your resource
nav-title: Data sources
order: 5
---

## Overview

A resource's data source acts as the interface between StellarAdmin and your application's data store. StellarAdmin comes with two data source out of the box, namely:

1. The `DelegateDataSource` allows you to specify the interaction between StellarAdmin and your data store through callback methods.
1. The `DbContextDataSource` (available in the `StellarAdmin.EntityFrameworkCore` NuGet package) takes care of all interaction between StellarAdmin and your application's `DbContext` on your behalf. If you use Entity Framework in your application, then this should be you first choice.

## Using the DelegateDataSource

The `DelegateDataSource` allows you to specify the interaction between StellarAdmin and your data store through callback methods. To use the `DelegateDataSource`, call the `UseDataSource()` method and use the overload that takes a `configure` parameter of type `Action<DelegateDataSourceOptions<TResource>>` as in the code example below.

```cs
builder.AddResource<Author>(rb =>
{
    rb.UseDataSource(options =>
    {
        options.OnCreate = async request =>
        {
            // ...
        };
        options.OnDelete = async request =>
        {
            // ...
        };
        options.OnUpdate = async request =>
        {
            // ...
        };
        options.OnGetList = async request =>
        {
            // ...
        };
        options.OnGetSingle = async request =>
        {
            // ...
        };
        options.OnGetLookupList = async request =>
        {
            // ...
        };
    });
}
```

* The `OnCreate` delegate is called when creating a new resource. It takes a `CreateRequest` parameter that contains the values entered by the user. It must return a `Task<ValidationResult>` that indicates whether the resource is valid or not.
* The `OnDelete` delegate is called when deleting a resource. It takes a `DeleteRequest` parameter that contains the primary key value of the resource to be deleted.
* The `OnUpdate` delegate is called when updating a resource. It takes an `UpdateRequest` parameter contains the primary key value of the resource to be deleted as well as the values entered by the user. It must return a `Task<ValidationResult>` that indicates whether the resource is valid or not.
* The `OnGetList` delegate is called when retrieving a list of resources. It takes a `GetListRequest` parameter with a `Query` property that contains paging information such as the `PageNo` and `PageSize`. You must return a `Task<PagedResourceList>` that contains the list of resources as well as paging information.
* The `OnGetSingle` delegate is called when retrieving a single instance of a resource. It takes a `GetSingleRequest` parameter with the primary key value of the resource. You must return a `Task<TResource?>` with the resource, or null if not found.
* The `OnGetLookupList` delefate is called when displaying the resource in a lookup list - such as when another resource references it.

Please refer to the [Contact List Sample](https://github.com/stellar-admin/samples/tree/master/ContactList) for a complete example of how to use the `DelegateDataSource` to read and write data from a custom data source.

## Using the DbContextDataSource

To use the `DbContextDataSource`, ensure that you can installed the `StellarAdmin.EntityFrameworkCore` NuGet package. 

When you register your resource, you can call the `UseDataSource<TDataSource, TOptions>()` method which takes two generic parameters:

1. `TDataSource` is the type of the data source you want to use, in this case, the `DbContextDataSource<TDbContext, TResource>`. `DbContextDataSource<TDbContext, TResource>` itself takes two paramters namely:
    - `TDbContext` is the type of your `DbContext`
    - `TResource` is the entity managed by the `DbContext` 
2. `TOptions` is an instance `DbContextDataSourceOptions<TResource>` where the `TResource` generic parameter is the entity class.

```cs
builder.AddResource<Author>(rb =>
{
    rb.UseDataSource<DbContextDataSource<BlogDbContext, Author>, DbContextDataSourceOptions<Author>>();

    // ...
});
```

Admittedly, all those generic parameters are painful to look at, so we made it easier for you by providing the `AddEntityResource<TDbContext, TResource>` extension method on the `StellarAdminBuilder` class. It takes your database context and entity type as generic parameters, and it will take care of the calls to `AddResource` and `UseDataSource` for you.

The `AddEntityResource` extension method allows you to replace the code above with the following, which is much easier to read and understand.

```cs
builder.AddEntityResource<BlogDbContext, Author>(rb =>
{
    // ...
});
```
