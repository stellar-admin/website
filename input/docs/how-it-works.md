order: 2
---

## Introduction

StellarAdmin works by defining "resources" that describe the data models or entities used by your application. For example, a blogging application may have resources for entities such as **Blog post**, **Author** and **Category**.

For each resource, you need to tell StellarAdmin a number of things, such as how to read and write data for the resource, the structure (i.e. properties, primary key, etc.) of the resource, and the actions a user can perform on a resource.

## Defining resources

You define resources when registering the StellarAdmin services in your application. Please refer to the [Resources documentation](resources) for more detail.

### Reading and writing data

When you define a resource in StellarAdmin, you need to specify the data source for the resource. The data source acts as the interface between StellarAdmin and your application's data store.

For more information on defining a data source, refer to the [Data sources documentation](datasources).

### Defining the resource structure

StellarAdmin needs to understand the structure of your resources. Specifically, it needs to know the fields (i.e. properties) of a resource and how those fields map to the properties of your data model. It also needs to know the primary key of a resource and the display field of a resource which is used when a resource is referenced by other resources.

As hinted in the previous sentence, StellarAdmin also allows you to define relationships between resources. In a blogging application, there will be a relationship between **blog post** and **author** ( a blog post is written by an author), as well as **blog post** and **category** (a blog post belongs to a category).

For more information on defining fields and relationships, refer to the [Fields documentation](fields).

### Defining and registering actions

StellarAdmin comes with a number of standard actions that can be performed on a resource, such as:

* creating a new resource,
* editing a resource, and
* deleting a resources

In many instances, you may also want users of your application to perform custom actions on a resource. For example, in a blogging application you may want to allow users to publish a new blog post which may require you to run custom business logic.

For more information on creating custom actions, refer to the [Actions documentation](actions).
