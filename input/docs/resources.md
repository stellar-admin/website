order: 3
---

## Introduction

StellarAdmin allows you to define _resources_ that represents the data your application works with. For example, an e-commerce application may have resources such as `Product`, `Order` and `Customer`. A resource can define _fields_, _actions_, as well as other behaviour such as whether a resource allow editing and deleting.

### Defining a resource

A resource is defined by creating a class that inherits from `ResourceDefinition<>` or, if you are using EF Core, `EfCoreResourceDefinition<,>`. 

When using `EfCoreResourceDefinition<,>`, a lot of functionality is taken care of for you, such as querying the resource, updating and deleting resources, etc. Using `ResourceDefinition<>` requires you to take care of these things yourself, but if gives you a lot more flexibility over where you get your data from. You can, for example, define a resource that represents information coming from as external API, such as Stripe.

* [Define a resource](define-resource)
* [Define an EF Core resource](define-ef-core-resource)