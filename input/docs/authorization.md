order: 8
---

## Introduction

StellarAdmin integrates with ASP.NET Core's endpoint authorization mechanisms. To allow only authenticated users access to StellarAdmin, add a call to `RequireAuthorization()` to the StellarAdmin endpoint registration.

```cs
app.UseEndpoints(endpoints =>
{
    //... other endpoints

    // Register StellarAdmin endpoints
    endpoints.MapStellarAdmin().RequireAuthorization();
});
```

If you only want to allow users that meet certain criteria to access StellarAdmin, you can configure authorization policies and pass the names of those authorization policies as a parameter to `RequireAuthorization()`. For more information on creating an authorization policy, refer to [Policy-based authorization in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies).

It is not currently possible to authorize access to certain resources and actions. This is on the roadmap and we plan to add this ability in the future.