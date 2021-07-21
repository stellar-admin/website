title: Defining the data source for your resource
navTitle: Data sources
xref: datasources-overview
---

## Overview

A resource's data source acts as the interface between StellarAdmin and your application's data store. StellarAdmin comes with two data sources out of the box, namely:

1. The `DbContextDataSource` (available in the `StellarAdmin.EntityFrameworkCore` NuGet package) takes care of all interaction between StellarAdmin and your application's `DbContext` on your behalf. If you use Entity Framework in your application, then this should be you first choice.
1. The `DelegateDataSource` allows you to specify the interaction between StellarAdmin and your data store through callback methods. This is a good choice when you use a data access technology other than Entity Framework Core.
