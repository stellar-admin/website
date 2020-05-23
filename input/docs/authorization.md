order: 8
---

## Introduction

StellarAdmin does not support any specific authorization extension points, but, since it is just a regular ASP.NET Core Razor Page and API Controllers, you can prevent access by making use of ASP.NET Core's built-in authorization features.

## Preventing access to StellarAdmin

Preventing access to StellarAdmin consists of two parts. First, you need to prevent access to the _Admin User Interface (UI)_ and secondly, you need to prevent access to the _API controllers_.

The Admin UI is a [Vue](https://vuejs.org/) application that is served by a single Razor Page to which access can be restricted by making use or Razor Pages [authorization conventions](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/razor-pages-authorization?view=aspnetcore-3.1).

The Admin UI communicates with the StellarAdmin backend via a set of API controllers. Access to these controllers can be restricted by creating a custom [Authorization Filter](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/filters?view=aspnetcore-3.1#authorization-filters).

### Preventing access to the Admin UI

The route of the Razor Page that is serving the Admin UI is `/StellarAdmin`, so you can prevent access to this page by 

```cs

```

### Preventing access to the API

...