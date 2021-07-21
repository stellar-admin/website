title: Restricting access to StellarAdmin
navTitle: Restricting access to SA
---

You can allow only authenticated users access to StellarAdmin by adding a call to `RequireAuthorization()` to the StellarAdmin endpoint registration.

```cs
app.UseEndpoints(endpoints =>
{
    // ...

    // Register StellarAdmin endpoints
    endpoints.MapStellarAdmin().RequireAuthorization();
});
```

If you have more fine-grained requirements regarding which set of users can access StellarAdmin, you can configure authorization policies and pass the names of those authorization policies as a parameter to `RequireAuthorization()`. 

The code example below demonstrates how you can declare an **IsAdministrator** policy that requires a user to have an **Administrator** role. The **IsAdministrator** policy name is then passed as a parameter in the call to `RequireAuthorization()` when the StellarAdmin endpoints are mapped. This will ensure that only users that are administrators will be able to access StellarAdmin.

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // ...

        services.AddAuthorization(o =>
        {
            o.AddPolicy("IsAdministrator", builder => builder.RequireRole("Administrator"));
        });
        
        services.AddStellarAdmin(builder =>
        {
            // ...
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        //...

        app.UseEndpoints(endpoints =>
        {
            // ...
            
            endpoints.MapStellarAdmin().RequireAuthorization("IsAdministrator");
        });
    }
}
```

You can refer to the [Authorization sample](https://github.com/stellar-admin/samples/tree/master/Authorization) for a demonstration on how to implement this. For more information on creating authorization policies, refer to [Policy-based authorization in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies).
