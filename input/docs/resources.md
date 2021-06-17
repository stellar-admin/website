order: 4
---

## Introduction

Central to StellarAdmin is the concept of "resources". A resource is a representation of the underlying domain models or entities that your application makes use of. For example, a blogging application may have resources for entities such as **Blog post**, **Author** and **Category**.

## Defining a resource

You define resources in StellarAdmin when you register the StellarAdmin services in your `Startup.ConfigureServices` method. The `AddStellarAdmin()` method takes an optional `configure` parameter that gives you access to the `StellarAdminBuilder` class that allows you to register resources. 

The builder has an `AddResource<TResource>` method you call to declare a resource. The `TResource` generic parameter specifies the model the resource will be managing. In the code below, we register a new resource that will manage the `Author` class.

```cs
services.AddStellarAdmin(builder =>
{
    builder.AddResource<Author>(rb =>
    {
        // ...
    });
});
```

The `AddResource<TResource>` method has a `configure` parameter that gives you access to the `ResourceDefinitionBuilder<TResource>` class that will allow you to define the resource. It allows you to do the following:

1. Define the data source of the resource through the `UseDataSource()` method
1. Define the fields of the resource through the `AddField()` method
1. Define the primary key of the resource through the `HasKey()` method
1. Define the display field of the resource through the `HasDisplay()` method
1. Register custom actions for the resource through the `AddSimpleAction()`, `AddConfirmationAction()`, and `AddFormAction()` methods.
