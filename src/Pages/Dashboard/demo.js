};



here wants to integrate the get api
process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL/api/admin/dashboard/sales?year=2025
where token is 
const token = sessionStorage.getItem('TokenForSuperAdminOfServiceProvider');

in responce in params they give the month so like if 1 then january if 2 then februvary if 3 then march like this 
and disply in graph like in y axis disply the sales in unit and week in y axis 

if select the week then in drowpdown 1,2,3,4 and if select teh 4 then disply like {
    "success": true,
    "message": "Data fetched successfully",
    "count": 3,
    "data": [
        {
            "day": "2025-01-23T05:00:00.000Z",
            "day_name": "Thursday",
            "sales": "609.00"
        },
        {
            "day": "2025-01-24T05:00:00.000Z",
            "day_name": "Friday",
            "sales": "1998.60"
        },
        {
            "day": "2025-01-25T05:00:00.000Z",
            "day_name": "Saturday",
            "sales": "1014.00"
        }
    ]
}
if selecet the today then in responce like 
{
    "success": true,
    "message": "Data fetched successfully",
    "count": 1,
    "data": [
        {
            "day": "2025-01-25T05:00:00.000Z",
            "day_name": "Saturday",
            "sales": "1014.00"
        }
    ]
}






