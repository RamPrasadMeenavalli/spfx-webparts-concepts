import * as React from 'react';
import styles from './WorldTime.module.scss';
import { IWorldTimeProps } from './IWorldTimeProps';

// import strings from localized resources
import * as strings from 'ClockWebPartStrings';

// import additional controls/components
import { Clock } from './Clock';
import * as timeZones from './Timezones';
import { Dropdown, Icon, IconButton, Panel } from 'office-ui-fabric-react';

export default class WorldTime extends React.Component<IWorldTimeProps, {}> {

  // this method determines the minutes offset of the selected time zone
  private convertTimeZoneIdToOffset(id: number): number {

    let result: number = 0;

    const matchingItems: timeZones.ITimeZone[] = timeZones.TimeZones.zones.filter((e: timeZones.ITimeZone, i: number) => {
      return(e.id === id);
    });

    if (matchingItems && matchingItems.length > 0) {
      result = matchingItems[0].offsetMinutes;
    }

    return(result);
  }

  public render(): React.ReactElement<IWorldTimeProps> {

    const timeZoneOffset = this.props.timeZoneOffset;
    const description = this.props.description;

    return (
      <div className={styles.worldTime}>
        <div className={styles.container}>
          <div className={styles.description}>
            {(description) ? description : strings.LocalTimeDescription}
          </div>
          <Clock timeZoneOffset={this.convertTimeZoneIdToOffset(timeZoneOffset)} />
        </div>

        <Panel isOpen={true}>
          Change the timezone
          <Dropdown options={[{key:"test", text:"test"}]}></Dropdown>
        </Panel>
      </div>
    );
  }
}
