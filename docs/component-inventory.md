# Component Inventory

This document lists all UI components required across the Food Delivery Web Application. Components are organized by category and will be built primarily using React, Tailwind CSS, and shadcn/ui.

---

## 1. Layout

Structural components used to wrap content and manage page anatomy.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Navbar** | Top navigation bar with logo, links, and user menu. | Default, Transparent, Dashboard | `user`, `cartCount` | All Pages | Navigation Menu |
| **Sidebar** | Vertical navigation for dashboards. | Admin, Restaurant, Customer | `links`, `isOpen` | Admin/Rest Dashboards | - |
| **Footer** | Page footer with links, socials, and copyright. | Default, Minimal | - | Public Pages | - |
| **Container** | Max-width wrapper for centering content horizontally. | - | `children`, `className` | All Pages | - |
| **PageWrapper** | Main layout wrapper managing min-height and padding. | - | `children`, `noPadding` | All Pages | - |
| **Grid** | Responsive grid layout container. | 2-cols, 3-cols, 4-cols | `columns`, `gap` | Market, Dashboard | - |
| **Section** | Vertical content block with standard spacing. | Default, Alternate BG | `title`, `subtitle` | Home, Profile | - |

---

## 2. Navigation

Components enabling user movement throughout the app.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MainNav** | Primary horizontal links for desktop. | - | `items` | Navbar | Navigation Menu |
| **MobileNav** | Hamburger menu and drawer for mobile devices. | - | `items`, `isOpen`, `onClose` | Navbar (Mobile) | Sheet |
| **Breadcrumbs** | Trail of links showing current page hierarchy. | - | `paths` (label, href) | Categories, Orders | - |
| **TabsNav** | Horizontal tabs for switching sub-views. | Default, Underline | `tabs`, `activeTab` | Profile, Restaurant | Tabs |
| **Pagination** | Controls for navigating multi-page lists. | - | `currentPage`, `totalPages`, `onPageChange` | Market, Data Tables | Pagination |
| **BackButton** | Simple button to navigate back in history. | - | `onClick`, `fallbackRoute` | Checkout, Forms | Button |

---

## 3. Data Display

Components presenting information, lists, and visual content.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RestaurantCard** | Displays restaurant info, rating, and image. | Grid, List, Featured | `restaurant` | Market, Favorites | Card |
| **MealCard** | Displays meal details, price, and add-to-cart button. | Standard, Compact | `meal`, `onAdd` | Menu, Search | Card |
| **CategoryCard** | Visual card for food categories (e.g., Pizza). | - | `category` | Home, Market | Card |
| **OrderCard** | Summary of a specific order. | Active, Past | `order` | Order History | Card |
| **ReviewCard** | Customer review with rating and text. | - | `review` | Restaurant Page | Card |
| **UserCard** | Brief user info display for admin/dashboard. | - | `user` | Admin Dashboard | Card |
| **CouponCard** | Displays coupon code and discount info. | - | `coupon`, `onApply` | Cart, Admin | Card |
| **StatCard** | KPI display for dashboards. | - | `title`, `value`, `icon`, `trend` | Dashboards | Card |
| **ChartCard** | Wrapper for various dashboard charts. | Line, Bar, Pie | `title`, `data`, `type` | Dashboards | Card |
| **DataTable** | Interactive table with sorting and pagination. | - | `columns`, `data`, `onSort` | Dashboards | Data Table |
| **EmptyState** | Fallback UI when no data is present. | - | `title`, `description`, `icon`, `action` | Cart, Search, Lists | - |
| **Badge** | Small label for status, categories, or tags. | Default, Outline, Solid | `text`, `variant`, `color` | Cards, Tables | Badge |
| **Avatar** | User profile image or initials fallback. | Small, Medium, Large | `src`, `alt`, `initials` | Navbar, Reviews | Avatar |
| **Rating** | Visual star rating display. | Interactive, ReadOnly | `value`, `count`, `onChange` | Reviews, Cards | - |
| **PriceTag** | Formatted price display with currency symbol. | - | `amount`, `currency`, `discount` | MealCard, Cart | - |

---

## 4. Forms

Input fields and form collections for user data entry.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Input** | Standard text input field. | Text, Password, Number | `value`, `onChange`, `error` | All Forms | Input |
| **TextArea** | Multi-line text input. | - | `value`, `onChange`, `rows` | Reviews, Notes | Textarea |
| **Select** | Dropdown selection field. | - | `options`, `value`, `onChange` | Settings, Filters | Select |
| **Checkbox** | Single or multi-selection toggle. | - | `checked`, `label`, `onChange` | Filters, Forms | Checkbox |
| **RadioGroup** | Mutually exclusive option selection. | - | `options`, `value`, `onChange` | Checkout, Forms | Radio Group |
| **Switch** | Toggle switch for boolean settings. | - | `checked`, `onChange` | Settings | Switch |
| **DatePicker** | Calendar input for date selection. | - | `date`, `onSelect` | Admin, Reports | Calendar, Popover |
| **FileUpload** | Drag-and-drop or click file upload area. | Single, Multiple | `onUpload`, `accept` | Profile, Restaurant | - |
| **SearchInput** | Input optimized for searching with icon. | - | `query`, `onSearch` | Navbar, Market | Input |
| **QuantitySelector** | Plus/minus controls for numerical input. | - | `value`, `min`, `max`, `onChange` | MealCard, Cart | - |
| **AddressForm** | Composite form for address details. | - | `defaultValues`, `onSubmit` | Profile, Checkout | Form |
| **LoginForm** | User authentication form. | - | `onSubmit`, `isLoading` | Login | Form |
| **RegisterForm** | New user registration form. | - | `onSubmit`, `isLoading` | Register | Form |
| **ProfileForm** | Form for updating user details. | - | `user`, `onSubmit` | Settings | Form |
| **MealForm** | Create/Edit meal for restaurants. | - | `meal`, `onSubmit` | Rest. Dashboard | Form |
| **RestaurantForm** | Create/Edit restaurant profile. | - | `restaurant`, `onSubmit` | Rest. Dashboard | Form |
| **CouponForm** | Admin form to create discounts. | - | `coupon`, `onSubmit` | Admin Dashboard | Form |

---

## 5. Feedback

Components communicating status, success, errors, or background processes.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Toast** | Brief notification popup. | Success, Error, Info | `title`, `description`, `variant`| Global | Toast / Sonner |
| **AlertDialog** | Interruptive dialog requiring confirmation. | Danger, Warning | `title`, `desc`, `onConfirm` | Deletions, Logout | Alert Dialog |
| **ConfirmDialog** | Standard confirmation modal. | - | `title`, `desc`, `onConfirm` | General actions | Dialog |
| **LoadingSpinner** | Circular loading indicator. | Small, Large | `size`, `color` | Loading States | - |
| **SkeletonCard** | Placeholder loading state for cards. | - | - | Market, Dashboards | Skeleton |
| **SkeletonTable** | Placeholder loading state for tables. | - | `rows`, `columns` | Dashboards | Skeleton |
| **SkeletonText** | Placeholder for text blocks. | - | `lines` | General Loading | Skeleton |
| **ProgressBar** | Horizontal progress indicator. | - | `value`, `max` | File Uploads | Progress |
| **StatusBadge** | Styled badge indicating order or user status. | Pending, Prep, Delivered| `status` | Orders, Tables | Badge |
| **ErrorBoundary** | Fallback UI for React errors. | - | `fallback` | Root levels | - |
| **ErrorPage** | Full-page 404, 500, or generic error view. | 404, 500, Generic | `code`, `message` | Routing | - |

---

## 6. Overlay

Floating or layered components that sit above standard content.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Modal** | Standard dialog overlay. | Default, Fullscreen | `isOpen`, `onClose`, `title` | Forms, Views | Dialog |
| **Drawer** | Slide-out panel (usually from side or bottom). | Left, Right, Bottom | `isOpen`, `onClose`, `side` | Mobile Filters | Sheet |
| **DropdownMenu** | Contextual menu attached to an element. | - | `trigger`, `items` | User Menu, Actions | Dropdown Menu |
| **Popover** | Rich content overlay relative to a trigger. | - | `trigger`, `content` | Filters, Cart Preview| Popover |
| **Tooltip** | Small hover label for context. | - | `content`, `children` | Icon Buttons | Tooltip |
| **Sheet** | Overlay panel, used primarily for cart sidebar. | - | `isOpen`, `onClose` | Cart | Sheet |

---

## 7. Actions

Interactive elements intended to trigger behaviors.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Button** | Primary clickable element. | Primary, Sec, Ghost, Link| `onClick`, `variant`, `size`, `disabled` | Everywhere | Button |
| **IconButton** | Button containing only an icon. | - | `icon`, `onClick`, `label` | Toolbars, Tables | Button |
| **FavoriteButton** | Heart toggle for saving items. | - | `isFavorite`, `onToggle` | RestaurantCard | Button |
| **AddToCartButton** | Specific CTA for adding meals. | - | `mealId`, `price`, `onAdd` | MealCard, Menu | Button |
| **QuantityControl** | Inline stepper for cart item counts. | - | `quantity`, `onIncrement`, `onDecrement` | Cart, Checkout | - |

---

## 8. Feature-Specific

Complex components composed of multiple basics for domain-specific features.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CartItem** | Row displaying a meal, quantity, and price. | - | `item`, `onUpdate`, `onRemove` | Cart Sheet, Checkout| - |
| **CartSummary** | Breakdown of subtotal, tax, delivery, and total. | - | `subtotal`, `fee`, `discount` | Cart Sheet, Checkout| - |
| **CheckoutForm** | Multi-step form for payment and delivery details. | - | `cart`, `onSubmit` | Checkout Page | Form |
| **OrderTimeline** | Visual tracker for real-time order status. | - | `status`, `timestamps` | Order Tracking | - |
| **OrderStatusBadge** | Specific badge tracking delivery lifecycle. | - | `status` | Orders List | Badge |
| **MenuCategoryTabs** | Sticky nav for scrolling to menu sections. | - | `categories`, `active` | Restaurant Page | Tabs |
| **RestaurantHeader** | Hero section for a restaurant profile. | - | `restaurantData` | Restaurant Page | - |
| **ReviewForm** | Interface for submitting a rating and review. | - | `onSubmit`, `orderId` | Past Orders | Form |
| **StarRating** | Interactive 5-star input. | - | `value`, `onChange` | ReviewForm | - |
| **DashboardChart** | Configured charts for specific metrics. | Revenue, Orders, Users | `data`, `timeRange` | Dashboards | - |
| **AnalyticsCard** | Composite card showing metric and mini-chart. | - | `metric`, `value`, `trendData` | Admin/Rest Dashboards| Card |

---

## 9. Theme

Components handling application-wide styling preferences.

| Name | Description | Variants | Props/Inputs | Used In | shadcn/ui Base |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ThemeToggle** | Button to switch between light and dark mode. | - | - | Navbar | Dropdown Menu |
| **ThemeProvider** | Context provider managing current theme. | - | `children` | App Root | - |
