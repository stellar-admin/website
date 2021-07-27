Segments gives users to ability to view a subset of resources based on pre-defined criteria. In a backend for an ordering application, you can for example create a segment to view all undelivered orders. There is no limit to the number of segments you can define, though you should probably not overwhelm the user with too many choices. Consider your users' daily workflow and define segments that assist them in performing their work.

![](segment-picker.png)

## Defining segments

You can add segments when you create your resource definition by calling the `AddSegment` method, passing a unique identifier as well as a title that must be shown to the user in StellarAdmin. 

```cs
builder.AddResource<Order>(rb =>
{
    rb.AddSegment("undelivered", "Undelivered");

    // ...
});
```

The segments you add will be displayed to the user above the list of resources on the resource index page, along with an **All** segment that will display all resources. When the user selects **All**, no segment will be applied.

## Filter resources for the segment

Once you have added your segments, you need to filter the resources based on the segment the user selected. The implementation will depend on the data source you are using.

### Using the Delegate datasource

When using the Delegate datasource, the selected segment identifier can be retrieved in the `OnGetList` handler as per the code sample below. It is up to you as to how you use the segment to filter the data. If your data source is a 3rd party API you can pass the relevant filter criteria for the segment to the API. If you are manually querying data, it is up to you to construct your database query to take the segment into account.

```cs
builder.AddResource<Contact>(rb =>
{
    // ...

    rb.UseDataSource(options =>
    {
        options.OnGetList = request =>
        {
            // Use the segment identifier to filter resources
            var segment = request.Query.Filter.Segment;

            // ...
        };
    });
});
```

### Using the EF Core datasource

When using the EF Core datasource, the selected segment identifier can be retrieved in the `ApplyFilters` handler. The code snippet below demonstrates how you can implement a segment that displays only the undelivered orders.

```cs
builder.AddEntityResource<StoreContext, Order>(rb =>
{
    rb.ConfigureDataSource(options =>
    {
        options.ApplyFilters = (orders, criteria) =>
        {
            switch (criteria.Segment)
            {
                case "undelivered":
                    orders = orders.Where(o => o.DeliveryDate == null);
                    break;
                // Handle other segments, if any...
            }

            return orders;
        };
    });

    // ...
});
```
