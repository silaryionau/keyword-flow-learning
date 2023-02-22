@api
Feature: API task
    Scenario: Verify DELETE User Request
        When User sends "POST" request to "{BASE_API_URL}/exercises/add" with Body "userdata.json"
        Then Status Code is "200"
        When User sends "GET" request to "{BASE_API_URL}/exercises/"
        Then Status Code is "200"
        When User remembers response property "$..body[?(@.username=='Simon' && @.duration==12012023)]._id" as "idForDelete"
            And User sends "DELETE" request to "{BASE_API_URL}/exercises/$idForDelete"
        When User sends "GET" request to "{BASE_API_URL}/exercises/"
        Then User verifies response does not contain property "duration" in "body" with value "12012023"
        Then User verifies response does not contain "$..body[?(@.username=='Simon' && @.duration==12012023)]"

    Scenario: Update exercise user
        When User sends "POST" request to "{BASE_API_URL}/exercises/add" with Body "userdata.json"
        Then Status Code is "200"
        When User sends "GET" request to "{BASE_API_URL}/exercises/"
        Then Status Code is "200"
        When User remembers response property "$..body[?(@.username=='Simon' && @.duration==1332222023)]._id" as "exerciseId"
            And User sends "POST" request to "{BASE_API_URL}/exercises/update/$exerciseId" with Body "userdata.json" and replaced values:
            | title    | new_value     |
            | username | Simon_updated |
        When User sends "GET" request to "{BASE_API_URL}/exercises/$exerciseId"
        Then User verifies response contains property "username" with value "Simon_updated"
        When User sends "DELETE" request to "{BASE_API_URL}/exercises/$exerciseId"
        