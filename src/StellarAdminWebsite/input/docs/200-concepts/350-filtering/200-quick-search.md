title: Quick search
---

Quick search allows an end user to quickly filter resources based on a search term. When enabled for a resource, a text box will be displayed above the list of resources on the resource index page. The user can type a search term in the text box and it is up to you as the developer to handle the filtering of the resources based on that search term.

![](quick-search-box.png)

## Enable quick search

Quick search is not enabled by default. You can enable quick search for a resource by setting the appropriate property when configuring the resource options.

```cs
builder.AddResource<Category>(rb =>
{
    rb.ConfigureOptions(options => options.Search.Allow = true);

    // ...
}
```

## Filter resources based on the search term

Once quick search is enabled, you can use the supplied search term to filter resources however you choose. For example, if you display a list of products, you can use the search term to search across both product titles and product descriptions for the search term.

The filtering implementation will depend on the type of data source you are using.

### Using the Delegate datasource

When using the Delegate datasource, the search term can be retrieved in the `OnGetList` handler as per the code sample below. It is up to you as to how you use this search term. If your data source is a 3rd party API that takes a search term, you can simply pass it along to the API. If you are manually querying data, it is up to you to construct your database query to take the search term into account.

```cs
builder.AddResource<Contact>(rb =>
{
    // ...

    rb.UseDataSource(options =>
    {
        options.OnGetList = request =>
        {
            // Apply search criteria
            if (!string.IsNullOrEmpty(request.Query.Filter.SearchTerm))
            {
                // Use the SearchTerm property to filter resources
            }

            // ...
        };
    });
});
```

### Using the EF Core datasource

When using the EF Core datasource, the search term can be retrieved in the `ApplyFilters` handler. The code snippet below demonstrates how you can use the search term to filter customers where either the first name or the last name contains the search term. 

```cs
builder.AddEntityResource<StoreContext, Customer>(rb =>
{
    rb.ConfigureDataSource(options =>
    {
        options.ApplyFilters = (customers, criteria) =>
        {
            if (!string.IsNullOrEmpty(criteria.SearchTerm))
            {
                customers = customers.Where(customer => EF.Functions.Like(customer.FirstName, $"%{criteria.SearchTerm}%")
                                                        || EF.Functions.Like(customer.LastName, $"%{criteria.SearchTerm}%"));
            }

            return customers;
        };
    });

    // ...
});
```
