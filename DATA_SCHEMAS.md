## JOB OBJECT
```json
    {
        id: "Job::0000000000",
        requested_by_number: "phone number of requester",
        facility_id: "facility_id_abcd1234",
        crs_id: "crs_0000000000",
        status: "pending|dispatched|completed",
        started_at: "datetime",
        dispatched_at: "datetime",
        completed_at: "datetime",
        state: {
            currently_calling: 'crs id'
        }
    }
```

## FACILITY OBJECT
```json
    {
        id: "facility_0000000000",
        name: "Thomas Jefferson University Hospital",
        address: "123 street rd, philadelphia pa 10102",
        phone_number: "+19999999999",
        request_history: ["request_0000000000", "request_1111111111", "request_2222222222"]
    }
```

## CRS OBJECT
```json
    {
        id: "csr_0000000000",
        first_name: "sally",
        last_name: "superhero",
        phone_number: "+17777777777",
        address: "123 street road, Philadelphia PA, 12345",
        last_called: "datetime",
        status: "on-call|unavailable|dispatched",
        request_history: ["request_0000000000", "request_1111111111", "request_2222222222"]
    }
```