title: Entity Framework Core datasource
navTitle: Entity Framework Core
---

If you are using EF Core in your application, you can make use of the `DbContextDataSource` which does a lot of the heavy lifting for you when it comes to querying your database
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
