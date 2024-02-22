locals {
  lambdas = {
    "auth_register" = {
      route_key     = "POST /register"
      function_name = "auth_register"
      handler       = "dist/apps/auth/auth.handler"
    },
    "auth_login" = {
      route_key     = "POST /login"
      function_name = "auth_login"
      handler       = "dist/apps/auth/auth.handler"
    },
    "get_properties_single" = {
      route_key     = "GET /properties/{id}"
      function_name = "get_properties_single"
      handler       = "dist/apps/property/property.handler"
    },
    "get_properties_list" = {
      route_key     = "GET /properties"
      function_name = "get_properties_list"
      handler       = "dist/apps/property/property.handler"
    },
    "get_properties_types" = {
      route_key     = "GET /properties/types"
      function_name = "get_properties_types"
      handler       = "dist/apps/property/property.handler"
    },
    "get_properties_statuses" = {
      route_key     = "GET /properties/statuses"
      function_name = "get_properties_statuses"
      handler       = "dist/apps/property/property.handler"
    },
    "add_properties" = {
      route_key     = "POST /properties"
      function_name = "post_properties"
      handler       = "dist/apps/property/property.handler"
    }
    "get_agents_list" = {
      route_key     = "GET /agents"
      function_name = "get_agents_list"
      handler       = "dist/apps/agent/agent.handler"
    },
    "get_agents_single" = {
      route_key     = "GET /agents/{id}"
      function_name = "get_agents_single"
      handler       = "dist/apps/agent/agent.handler"
    }
  }
}
