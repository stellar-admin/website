order: 3
---

## Introduction

StellarAdmin allows you to create _resource definitions_ that describe the data your application works with. For example, an e-commerce application may have resource definitions for entities such as **Product**, **Order** and **Customer**.

A resource definition has [fields](fields) and [actions](actions) and takes care of querying and updating the underlying data source. A resource definition also defines other behaviour such as whether a resource allows editing and deleting.

## Defining a resource

A resource definition is defined by creating a class that inherits from `ResourceDefinition<TResource>` or, if you are using EF Core, `EfCoreResourceDefinition<TDbContext, TResource>`.

When using `EfCoreResourceDefinition<TDbContext, TResource>`, a lot of functionality is taken care of for you, such as querying the resource, updating and deleting resources, etc. Using `ResourceDefinition<TResource>` requires you to take care of these things yourself, but it gives you a lot more flexibility over where you get your data from. You can, for example, define a resource that represents information coming from as external API, such as Stripe.

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

In order to create a resource definition that will allows you to maintain Contacts, you can create the following resource definition:

```cs
public class ContactDefinition : EfCoreResourceDefinition<ApplicationDbContext, Contact>
{
    public ContactDefinition(StoreContext dbContext) : base(dbContext)
    {
        HasField(c => c.Id, f => f.IsKey = true);
        HasField(c => c.FirstName);
        HasField(c => c.LastName);
        HasField(c => c.Email);
    }
}
```

Note that in the resource definition above we have also defined fields. You can read more about defining fields in your [Fields documentation](/docs/fields).

You can refer to the [Store Sample](https://github.com/stellar-admin/samples/tree/master/Store) for a more detailed example on how to create resource definitions for EF Core.

### Using another data source

If you want to create a resource definition that represents data coming from another source, you can inherit from `ResourceDefinition<TResource>` and implement the following abstract methods:

#### GetListAsync

Called when a list of resources is retrieved. The `query` parameter will contain paging information such as the `PageNo` and `PageSize`. You will need to return a `PagedResourceList` that will contain the list of resources as well as paging information.

#### GetByKeyAsync

Called when a single instance of a resource is retreived. The `key` parameter will contain the primary key value of the resource. You will need to return the resource or null if it is not found.

#### CreateAsync

Called when a new resource must be created. The `values` dictionary will contain key-value pairs with the field names and values. You can call the `SetResourceValues` protected method to apply the values to a resource instance.
  
The `CreateAsync` method must return a `ValidationResult` that indicates whether the resource is valid or not. The `ValidateResource` protected method can be called to validate a resource instance and you can return the result.

#### UpdateAsync

Called when a resource is updated. The `key` parameter will contain the primary key value of the resource. The `values` dictionary will contain key-value pairs with the field names and values. You can call the `SetResourceValues` protected method to apply the values to a resource instance.

The `UpdateAsync` method must return a `ValidationResult` that indicates whether the resource is valid or not. The `ValidateResource` protected method can be called to validate a resource instance and you can return the result.

#### DeleteAsync

Called when a resource must be deleted. The `key` parameter will contain the primary key of the resource that must be deleted.

#### GetLookupListAsync

Called when the resource is displayed in a lookup list - such as when it is referenced by another resource.

Please refer to the [Contact List Sample](https://github.com/stellar-admin/samples/tree/master/ContactList) for an example of how to implement a resource definition that gets data from a custom data source.
