# Low-Fidelity Wireframes

These ASCII wireframes represent the core layout and structure of the main pages in the application.

## Customer-Facing Screens

### 1. Home Page
```text
+-----------------------------------------------------------------------------+
| [Logo]        [ Search for restaurants, cuisines... ]      [Login] [Sign Up]|
+-----------------------------------------------------------------------------+
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  |                                                                       |  |
|  |                       HUNGRY? ORDER NOW!                              |  |
|  |                 [ Browse All Restaurants ]                            |  |
|  |                                                                       |  |
|  +-----------------------------------------------------------------------+  |
|                                                                             |
|  Categories:  (Pizza)  (Burger)  (Sushi)  (Healthy)  (Dessert)              |
|                                                                             |
|  Popular Restaurants                                                        |
|  +----------------+  +----------------+  +----------------+                 |
|  | [Image]        |  | [Image]        |  | [Image]        |                 |
|  | Joe's Pizza    |  | Burger King    |  | Sushi Master   |                 |
|  | ★ 4.8 (120)    |  | ★ 4.5 (300)    |  | ★ 4.9 (80)     |                 |
|  +----------------+  +----------------+  +----------------+                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```
*Notes: Hero banner for promotions. Quick category filters. Grid of highly rated restaurants.*

### 2. Restaurant Listing Page
```text
+-----------------------------------------------------------------------------+
| [Logo]        [ Search for restaurants... ]                [Profile] [Cart] |
+-----------------------------------------------------------------------------+
| Filters                 |  All Restaurants (124 Results)                    |
|                         |                                                   |
| Sort By:                |  +---------------------------------------------+  |
| ( ) Recommended         |  | [Image] | Joe's Pizza                       |  |
| (x) Rating              |  |         | Pizza, Fast Food - 30-40 min      |  |
| ( ) Delivery Time       |  |         | ★ 4.8 (120) - Free Delivery       |  |
|                         |  +---------------------------------------------+  |
| Cuisine:                |                                                   |
| [x] Pizza               |  +---------------------------------------------+  |
| [ ] Burgers             |  | [Image] | Pasta House                       |  |
| [ ] Healthy             |  |         | Italian, Pasta - 40-55 min        |  |
|                         |  |         | ★ 4.6 (95) - $2.99 Delivery       |  |
| Price:                  |  +---------------------------------------------+  |
| [ $ ] [ $$ ] [ $$$ ]    |                                                   |
|                         |        < Prev   [1]  2  3  4   Next >             |
+-----------------------------------------------------------------------------+
```
*Notes: Left sidebar for filtering and sorting. Main area shows horizontal restaurant cards. Pagination at the bottom.*

### 3. Restaurant Detail Page
```text
+-----------------------------------------------------------------------------+
| [Logo]                                                     [Profile] [Cart] |
+-----------------------------------------------------------------------------+
| +-----------------------------------------------------------------------+   |
| |  [Cover Image]                                                        |   |
| |  Joe's Pizza                                          ★ 4.8 (120)     |   |
| |  Pizza, Italian - Open until 11:00 PM                 Min Order: $10  |   |
| +-----------------------------------------------------------------------+   |
|                                                                             |
|  [ Pizzas ]  [ Sides ]  [ Drinks ]  [ Desserts ]  [ Info & Reviews ]        |
|  -----------------------------------------------------------------------    |
|  Pizzas                                                                     |
|  +------------------------+  +------------------------+                     |
|  | Margherita Pizza       |  | Pepperoni Pizza        |                     |
|  | Classic cheese & tomato|  | Double pepperoni       |                     |
|  | $12.99        [+ Add]  |  | $14.99        [+ Add]  |                     |
|  +------------------------+  +------------------------+                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```
*Notes: Large header with restaurant details. Sticky tabs for menu categories. Grid of meal cards.*

### 4. Meal Detail Modal
```text
+-----------------------------------------------------------------------------+
|                                                                             |
|      +-------------------------------------------------------------+        |
|      |  [X]                                                        |        |
|      |  +-------------------------------------------------------+  |        |
|      |  |                      [Meal Image]                     |  |        |
|      |  +-------------------------------------------------------+  |        |
|      |                                                             |        |
|      |  Pepperoni Pizza                                  $14.99    |        |
|      |  Fresh dough, homemade tomato sauce, mozzarella, and double |        |
|      |  pepperoni baked to perfection.                             |        |
|      |                                                             |        |
|      |  Special Instructions (Optional):                           |        |
|      |  [ No onions, extra crispy...                          ]    |        |
|      |                                                             |        |
|      |  [-] 1 [+]                             [ Add to Cart - $14.99 ]|     |
|      +-------------------------------------------------------------+        |
|                                                                             |
+-----------------------------------------------------------------------------+
```
*Notes: Pop-up modal when a meal is clicked. Allows quantity adjustment and special notes.*

### 5. Cart Sidebar
```text
+-----------------------------------------------------------------------------+
|                                               |  Your Cart            [X]   |
|                                               |  ------------------------   |
|                                               |  Joe's Pizza                |
|                                               |                             |
|                                               |  1x Pepperoni Pizza  $14.99 |
|                                               |     [-] 1 [+]      [Remove] |
|                                               |                             |
|                                               |  2x Coke              $3.98 |
|                                               |     [-] 2 [+]      [Remove] |
|                                               |  ------------------------   |
|                                               |  Subtotal:           $18.97 |
|                                               |  Delivery Fee:        $2.99 |
|                                               |  Tax:                 $1.50 |
|                                               |  ------------------------   |
|                                               |  Total:              $23.46 |
|                                               |                             |
|                                               |  [      Checkout      ]     |
+-----------------------------------------------------------------------------+
```
*Notes: Slide-out drawer or page. Displays items, breakdown of costs, and CTA to checkout.*

### 6. Checkout Page
```text
+-----------------------------------------------------------------------------+
| [Logo]                     Secure Checkout                                  |
+-----------------------------------------------------------------------------+
|  1. Delivery Address                                |  Order Summary        |
|  +---------------------------------------------+    |  Joe's Pizza          |
|  | (x) Home: 123 Main St, Apt 4B               |    |                       |
|  | ( ) Work: 456 Office Tower                  |    |  1x Pepperoni $14.99  |
|  | [ + Add New Address ]                       |    |  2x Coke       $3.98  |
|  +---------------------------------------------+    |                       |
|                                                     |  Subtotal:    $18.97  |
|  2. Payment Method                                  |  Delivery:     $2.99  |
|  +---------------------------------------------+    |  Tax:          $1.50  |
|  | (x) Credit Card (Stripe)                    |    |                       |
|  |     [ Card Number                     ]     |    |  Total:       $23.46  |
|  |     [ MM/YY ] [ CVC ]                       |    |                       |
|  | ( ) Cash on Delivery                        |    |  [ Place Order ]      |
|  +---------------------------------------------+    |                       |
+-----------------------------------------------------------------------------+
```
*Notes: Split layout. Left for user input (address, payment). Right for order summary and final confirmation.*

### 7. Order Tracking Page
```text
+-----------------------------------------------------------------------------+
| [Logo]                                                     [Profile] [Cart] |
+-----------------------------------------------------------------------------+
|  Order #ORD-987654321                                                       |
|  Estimated Delivery: 8:45 PM                                                |
|                                                                             |
|  Status: Preparing                                                          |
|  [====(Accepted)========(Preparing)--------(On the Way)-------(Delivered)]  |
|                                                                             |
|  Order Details:                                                             |
|  From: Joe's Pizza                            Total Paid: $23.46            |
|  To: 123 Main St, Apt 4B                      Method: Credit Card           |
|                                                                             |
|  Items:                                                                     |
|  1x Pepperoni Pizza                                                         |
|  2x Coke                                                                    |
|                                                                             |
|  [ Need Help? Contact Support ]               [ Cancel Order (Disabled) ]   |
+-----------------------------------------------------------------------------+
```
*Notes: Real-time progress bar. Shows details and prevents cancellation once preparation has started.*

---

## Restaurant Owner Screens

### 11. Restaurant Dashboard
```text
+-----------------------------------------------------------------------------+
| [Logo]  | Dashboard       |  Overview                                       |
|         | Orders          |  +-------------+ +-------------+ +-------------+|
| Menu    | Menu            |  | Today Sales | | New Orders  | | Avg Rating  ||
|         | Earnings        |  | $450.00     | | 24          | | 4.8 / 5.0   ||
|         | Settings        |  +-------------+ +-------------+ +-------------+|
|         |                 |                                                 |
|         | [Logout]        |  Recent Orders                                  |
|         |                 |  #1234 - John D. - $24.50 - [ Accept ] [ Reject]|
|         |                 |  #1233 - Mary S. - $15.00 - [ Preparing ]       |
+-----------------------------------------------------------------------------+
```
*Notes: Sidebar navigation. KPI cards at the top. Quick actions for recent incoming orders.*

---

## Admin Screens

### 14. Admin Dashboard
```text
+-----------------------------------------------------------------------------+
| [Logo]  | Dashboard       |  Platform Overview                              |
|         | Users           |  +-------------+ +-------------+ +-------------+|
| Admin   | Restaurants     |  | Total Users | | Active Rest.| | Total Rev.  ||
|         | Categories      |  | 1,245       | | 85          | | $12,400     ||
|         | Coupons         |  +-------------+ +-------------+ +-------------+|
|         |                 |                                                 |
|         | [Logout]        |  Pending Restaurant Approvals                   |
|         |                 |  Sushi Master - [ View ] [ Approve ] [ Reject ] |
|         |                 |  Taco Fiesta  - [ View ] [ Approve ] [ Reject ] |
+-----------------------------------------------------------------------------+
```
*Notes: Super-user view. Focus on platform metrics and approval queues.*
