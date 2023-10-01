# System should restore from the snapshot after every restart.
it does restore by default from dump.rdb file on every restart.

# System should be configured to take a snapshot after every 1 sec.
for that we ca add " save 1 1 " this line in redis.windows.conf file and it will save snapshot after every second if there is at least 1 change.