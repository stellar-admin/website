order: 3
---

## Introduction

StellarAdmin allows you to create _resource definitions_ that describe the data models of your application. For example, an e-commerce application may have resource definitions for entities such as **Product**, **Order** and **Customer**.

A resource definition has [fields](fields) and [actions](actions) and takes care of querying and updating the underlying data source. A resource definition also defines other behaviour, such as whether a resource allows editing and deleting.

## Defining a resource

You define a resource definition by creating a class that inherits from `ResourceDefinition<TResource>` or, if you are using EF Core, `EfCoreResourceDefinition<TDbContext, TResource>`.

When using `EfCoreResourceDefinition<TDbContext, TResource>`, most functionality is taken care of for you, such as querying the resource, updating and deleting resources, etc. Using `ResourceDefinition<TResource>` requires you to take care of this functionality yourself, but it gives you a lot more flexibility over where you get your data from. You can, for example, define a resource that represents information coming from an external API, such as Stripe.

### Using EF Core

The EF Core use case is the simplest, so let's look at that first. In this scenario, let's assume the following database context and model:

```cs
public class Contact
{
    public int Id { get; set; }

    public string Email { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Contact> Contacts { get; set; }
}
```

You can create a resource definition that allows you to maintain Contacts:

```cs
public class ContactDefinition : EfCoreResourceDefinition<ApplicationDbContext, Contact>
{
    public ContactDefinition(ApplicationDbContext dbContext)
        : base(dbContext)
    {
    }
}
```

You need to define the `TDbContext` and `TResource` generic parameters which are the database context and entity types respectively. The base constructor of the EF Core resource definition takes a `dbContext` parameter which is an instance of your database context type.

All resource definitions are registered with the ASP.NET Core dependency injection, so you can inject any other service you require in the constructor of your resource definition. Also ensure that your database context it is registered with the ASP.NET Core dependency injection as per the [ASP.NET Core docs](https://docs.microsoft.com/en-us/aspnet/core/data/ef-rp/intro?view=aspnetcore-3.1&tabs=visual-studio#startupcs))

You can refer to the [Store Sample](https://github.com/stellar-admin/samples/tree/master/Store) for a more detailed example of how to create resource definitions for EF Core.

### Using another data source

If you want to create a resource definition that represents data coming from another source, you can inherit from `ResourceDefinition<TResource>`. You resource definition class will need to override the following `abstract` methods defined in `ResourceDefinition<TResource>`:

#### GetListAsync

This method executes when retrieving a list of resources. The `query` parameter contains paging information such as the `PageNo` and `PageSize`. You need to return a `PagedResourceList` that contains the list of resources as well as paging information.

#### GetByKeyAsync

The method executes when retrieving a single instance of a resource. The `key` parameter contains the primary key value of the resource. You must return the resource or null if not found.

#### CreateAsync

This method executes when creating a new resource. The `values` dictionary contains key-value pairs with the field names and values. You can call the `SetResourceValues` protected method to apply the values to a resource instance.
  
The `CreateAsync` method must return a `ValidationResult` that indicates whether the resource is valid or not. The `ValidateResource` protected method can be called to validate a resource instance, and you can return the result.

#### UpdateAsync

The method executes when updating a resource. The `key` parameter contains the primary key value of the resource. The `values` dictionary contains key-value pairs with the field names and values. You can call the `SetResourceValues` protected method to apply the values to a resource instance.

The `UpdateAsync` method must return a `ValidationResult` that indicates whether the resource is valid or not. The `ValidateResource` protected method can be called to validate a resource instance, and you can return the result.

#### DeleteAsync

This method executes when deleting a resource. The `key` parameter contains the primary key of the resource to be deleted.

#### GetLookupListAsync

This method executes when displaying the resource in a lookup list - such as when another resource references it.

Please refer to the [Contact List Sample](https://github.com/stellar-admin/samples/tree/master/ContactList) for an example of how to implement a resource definition that gets data from a custom data source.
