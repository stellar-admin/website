order: 3
---

## Introduction

StellarAdmin allows you to create _resource definitions_ that describe the data your application works with. For example, an e-commerce application may have resource definitions for entities such as **Product**, **Order** and **Customer**.

A resource definition has [fields](fields) and [actions](actions) and takes care of querying and updating the underlying data source. A resource definition also defines other behaviour such as whether a resource allows editing and deleting.

### Defining a resource

A resource definition is defined by creating a class that inherits from `ResourceDefinition<>` or, if you are using EF Core, `EfCoreResourceDefinition<,>`.

When using `EfCoreResourceDefinition<,>`, a lot of functionality is taken care of for you, such as querying the resource, updating and deleting resources, etc. Using `ResourceDefinition<>` requires you to take care of these things yourself, but it gives you a lot more flexibility over where you get your data from. You can, for example, define a resource that represents information coming from as external API, such as Stripe.

* [Define a resource](define-resource)
* [Define an EF Core resource](define-ef-core-resource)