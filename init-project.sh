#!/bin/bash

# CLIENT (Frontend)
mkdir -p client/src/{assets/{images,icons,logo},components/{common,layout},pages/{auth,admin,security,driver},services,routes,context,utils}
mkdir -p client/public

# SERVER (Backend)
mkdir -p server/{config,models,controllers,routes,middleware,services,utils}

# DOCS
mkdir -p docs/{requirements,uml,api}

# ROOT FILES
touch README.md .gitignore package.json

# CLIENT FILES
touch client/package.json
touch client/public/{index.html,favicon.ico}
touch client/src/{App.jsx,main.jsx}
touch client/src/components/common/{Button.jsx,Input.jsx,Modal.jsx,Loader.jsx}
touch client/src/components/layout/{Navbar.jsx,Sidebar.jsx,Footer.jsx}
touch client/src/pages/auth/{Login.jsx,Register.jsx}
touch client/src/pages/admin/{Dashboard.jsx,Buildings.jsx,Basements.jsx,ParkingSlots.jsx,Pricing.jsx,Subscriptions.jsx,SecurityManagement.jsx,Reports.jsx}
touch client/src/pages/security/{Entry.jsx,Exit.jsx,SlotAllocation.jsx,Ticket.jsx,PaymentVerification.jsx}
touch client/src/pages/driver/{Dashboard.jsx,SlotAvailability.jsx,TicketView.jsx,TicketView.jsx,Payment.jsx,Subscription.jsx}
touch client/src/services/{authService.js,adminService.js,securityService.js,driverService.js}
touch client/src/routes/{PrivateRoute.jsx,RoleRoute.jsx}
touch client/src/context/{AuthContext.jsx,SocketContext.jsx}
touch client/src/utils/{constants.js,helpers.js}

# SERVER FILES
touch server/package.json server/.env.example server/{app.js,server.js}
touch server/config/{db.js,jwt.js,socket.js}
touch server/models/{User.model.js,Building.model.js,Basement.model.js,ParkingSlot.model.js,Vehicle.model.js,ParkingSession.model.js,Subscription.model.js,Payment.model.js,Ticket.model.js}
touch server/controllers/{auth.controller.js,admin.controller.js,security.controller.js,driver.controller.js,parking.controller.js,billing.controller.js,report.controller.js}
touch server/routes/{auth.routes.js,admin.routes.js,security.routes.js,driver.routes.js,parking.routes.js,billing.routes.js,report.routes.js}
touch server/middleware/{auth.middleware.js,role.middleware.js,error.middleware.js,validate.middleware.js}
touch server/services/{payment.service.js,notification.service.js,slot.service.js}
touch server/utils/{constants.js,helpers.js,logger.js}

echo "✅ Project structure created in current directory!"
