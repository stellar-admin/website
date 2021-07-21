title: Action results
---

An action must return an `ActionResult` that indicates either success or failure. To return a successful result, you can return `ActionResult.Success()`. Conversely, you can return `ActionResult.Failure()` to indicate that the action was not executed successfully.

You can also alter the response by chaining the following methods to the response:

* `WithRefresh()` indicates to StellarAdmin that it should refresh the current view. You should call this whenever you perform an action that alters the content of the current page. Otherwise, the changes made by your action will not be reflected.
* `WithNotification("...")` will display a notification toast with the text specified to the user. The visual appearance of the toast will depend on whether the action was successful or not.

You can refer to the various code examples earlier in this document to see this in action.