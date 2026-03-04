“I built this tool mainly as a learning project and resume showcase. It demonstrates concurrency handling, async scheduling, metrics aggregation, and API testing concepts. I chose not to deploy it publicly because stress testing arbitrary APIs from a server could cause legal or technical issues. The repo shows the full implementation and design.”

current changes needed:
a. Error categorization needs to be done to know exactly which types of errrors are happening;
b. One thing is flawed and that is the recent session thing: the server should not be restarted if you want to maintain the metrics for recent sessions this needs to be chnaged to the localStorage where metrics are stored alongwith the testID. or to the database rather...
c. One more important becnhmarks has to be added and that is per 10 sec stats showing the live health and not recent because the endpoint might be behaving good/bad in tart but may act poorly/good at the end of tests..
