import { FC, useState } from "react"
import { LoadingSpinner, useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { ErrorBlock } from "../components/ErrorBlock";
import { getCurrentUser } from "../api/api";
import { Settings, TicketData } from "../types/settings";
import { useUser } from "../context/userContext";

const LoadingPage: FC = () => {
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<TicketData, Settings>()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isFetchingAuth, setIsFetchingAuth] = useState<boolean>(true)

  const navigate = useNavigate()
  const deskproUser = useUser();

  // Determine authentication method from settings
  const isUsingOAuth = context?.settings.use_access_token === false || context?.settings.use_advanced_connect === false

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements()
    registerElement("pipedriveRefreshButton", { type: "refresh_button" })
  });

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Pipedrive")

    if (!context?.settings || !deskproUser) {
      return
    }

    // Store the authentication method in the user state
    client.setUserState("isUsingOAuth", isUsingOAuth)

    // Verify authentication status
    // If OAuth mode and the user is logged in the request would be make with their stored access token
    // If api key mode the request would be made with the api key provided in the app setup
    getCurrentUser(client, deskproUser.orgName)
      .then((data) => {
        if (data) {
          setIsAuthenticated(true)
        }
      })
      .catch(() => { })
      .finally(() => {
        setIsFetchingAuth(false)
      })
  }, [context, context?.settings])

  if (!client || isFetchingAuth || !deskproUser) {
    return (<LoadingSpinner />)
  }

  if (isAuthenticated) {
    // Check for linked contacts and navigate based
    // on the number of linked contacts
    client.getEntityAssociation("linkedPipedriveContacts", deskproUser.id).list()
      .then((linkedContactIds) => {
        linkedContactIds.length < 1 ? navigate("/contacts") :
          navigate("/home")
      })
      .catch(() => { navigate("/contacts") })
  } else {

    if (isUsingOAuth) {
      navigate("/login")
    } else {
      // Show error for invalid api keys (expired or not present)
      return (
        <div style={{width: "100%", padding: 12, boxSizing: "border-box"}} >
          <ErrorBlock text={"Invalid API Key"} />
        </div>
      )
    }
  }

  return (<LoadingSpinner />);
}

export default LoadingPage