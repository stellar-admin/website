order: 10
---

## Introduction

StellarAdmin integrates with the standard ASP.NET Core [authentication and authorization mechanisms](https://docs.microsoft.com/en-us/aspnet/core/security/). If you wish to limit access to StellarAdmin to authenticated users, you will need to authenticate your users using one of the methods as desribed in the [ASP.NET Core Authentication documentation](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/).

### Authorizing access to StellarAdmin

Once you have authenticated your users, you can allow only authenticated users access to StellarAdmin by adding a call to `RequireAuthorization()` to the StellarAdmin endpoint registration.

```cs
app.UseEndpoints(endpoints =>
{
    // ...

    // Register StellarAdmin endpoints
    endpoints.MapStellarAdmin().RequireAuthorization();
});
```

If you have more fine-grained requirements as to which set of users can access StellarAdmin, you can configure authorization policies and pass the names of those authorization policies as a parameter to `RequireAuthorization()`. For more information on creating an authorization policy, refer to [Policy-based authorization in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies).

**Please note:** It is not currently possible to authorize access to specific resources and actions. This is on the roadmap and we plan to add this ability in the future.