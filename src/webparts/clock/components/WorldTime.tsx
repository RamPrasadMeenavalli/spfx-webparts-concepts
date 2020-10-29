import * as React from 'react';
import styles from './WorldTime.module.scss';
import { IWorldTimeProps } from './IWorldTimeProps';

// import strings from localized resources
import * as strings from 'ClockWebPartStrings';

// import additional controls/components
import { Clock } from './Clock';
import * as timeZones from './Timezones';
import { Dropdown, Icon, IconButton, Panel } from 'office-ui-fabric-react';
import { IPropertyPaneDropdownOption } from '@microsoft/sp-property-pane';
import {PnPClientStorage, dateAdd} from "@pnp/common";

export interface IWorldTimeState{
  showPanel:boolean;
  timeZoneOffset: number;
}
export default class WorldTime extends React.Component<IWorldTimeProps, IWorldTimeState> {

  private _storage:PnPClientStorage;

  constructor(props:IWorldTimeProps){
    super(props);
    this._storage = new PnPClientStorage();
    this.state={
      showPanel: false,
      timeZoneOffset: this.props.timeZoneOffset,
    }
  }

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

    var timeZoneOffset = this.state.timeZoneOffset;
    if(this._storage.local.get(`${this.props.webpartId}-${this.props.loginName}`)){
      timeZoneOffset = this._storage.local.get(`${this.props.webpartId}-${this.props.loginName}`)
    }
    const description = timeZones.TimeZones.getTimeZone(timeZoneOffset).displayName;

    return (
      <div className={styles.worldTime}>
        <div className={styles.container}>
          <div className={styles.description}>
            {(description) ? description : strings.LocalTimeDescription}
            <IconButton onClick={() => {this.setState({showPanel:true})}}><Icon iconName="Edit"></Icon> </IconButton>
          </div>
          <Clock timeZoneOffset={this.convertTimeZoneIdToOffset(timeZoneOffset)} />
        </div>

        <Panel
          isOpen={this.state.showPanel}
        >
          Choose a time zone
          <Dropdown options={this.getTimeZones()} selectedKey={this.state.timeZoneOffset} onChange={this._onPropertyChange}></Dropdown>
        </Panel>
      </div>
    );
  }

  private getTimeZones(): Array<IPropertyPaneDropdownOption> {
    var result: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();

    for (let tz of timeZones.TimeZones.zones) {
      result.push({ key: tz.id, text: tz.displayName});
    }

    return(result);
  }

  private _onPropertyChange = (event, option, index) => {
    this.setState({
      showPanel: false,
      timeZoneOffset: option.key,
    }, () => {

      //Persist the user selected value
      this._storage.local.put(`${this.props.webpartId}-${this.props.loginName}`, option.key, dateAdd(new Date(), 'year', 100));
    })
  }
}
