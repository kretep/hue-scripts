#!/bin/sh

# To automatically start and keep hue sript running,
# copy this file to /usr/local/etc/rc.d/ and
# chmod 755
# ./bootstrap-hue.sh start
# This file will not be removed on DSM updates.

case ${1} in 
  start)

    # Copy hue.conf to upstart directory, to make sure
    # it is there (it will be removed when DSM updates)
    cp /volume1/apps/hue/hue.conf /etc/init/

    # Run the script (upstart also runs it, but not
    # if the hue.conf was missing).
    start hue

    ;;
esac
