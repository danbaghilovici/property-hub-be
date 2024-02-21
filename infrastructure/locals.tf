locals {
  lambdas = {
    "gateway" = {
      route_key     = "GET /gateway"
      function_name = "gateway"
      handler       = "dist/apps/gateway/gateway.handler"
    },
    "add_gateway" = {
      route_key     = "POST /gateway"
      function_name = "add_gateway"
      handler       = "dist/apps/gateway/gateway.handler"
    },
    "get_properties" = {
      route_key     = "GET /properties"
      function_name = "get_properties"
      handler       = "dist/apps/property/property.handler"
    }
    "get_properties" = {
      route_key     = "POST /properties"
      function_name = "post_properties"
      handler       = "dist/apps/property/property.handler"
    }
    "get_agents" = {
      route_key     = "GET /agents"
      function_name = "get_agents"
      handler       = "dist/apps/agent/agent.handler"
    },
    "get_agent" = {
      route_key     = "GET /agents/{id}"
      function_name = "get_agent"
      handler       = "dist/apps/agent/agent.handler"
    }
  }
}
