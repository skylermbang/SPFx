import * as React from 'react';
import styles from './StopWatch.module.scss';
import type { IStopWatchProps } from './IStopWatchProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


interface IStopWatchState {
  timeSecond: number;
  timeMinute: number;
  timeHour: number;
  isRunning: boolean;
  listTime: any[];
}

export default class StopWatch extends React.Component<IStopWatchProps, IStopWatchState> {
  private timer: any = null;
  private sp: ReturnType<typeof spfi>;


  
  constructor(props: IStopWatchProps) {
    super(props);

    // Initialize state
    this.state = {
      timeSecond: 0,
      timeMinute: 0,
      timeHour: 0,
      isRunning: false,
      listTime:[],
    };

    // Initialize PnPJS context
    this.sp = spfi().using(SPFx(this.props.context));
  }


  fetchListItems = async () => {
    try {

      const items: any[] = await this.sp.web.lists.getByTitle("stopWatch").items();
      this.setState({ listTime: items });
      console.log(items)
    } catch (error) {
      console.error("Error fetching list items:", error);
    }
  };

  async componentDidMount() {
    await this.fetchListItems();
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  handleStartStop = () => {
    if (this.state.isRunning) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.timer = setInterval(() => {
        let { timeSecond, timeMinute, timeHour } = this.state;

        timeSecond++;

        if (timeSecond === 60) {
          timeSecond = 0;
          timeMinute++;
        }
        if (timeMinute === 60) {
          timeMinute = 0;
          timeHour++;
        }

        this.setState({ timeSecond, timeMinute, timeHour });
      }, 1000);
    }

    this.setState({ isRunning: !this.state.isRunning });
  };

  handleReset = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.setState({
      timeSecond: 0,
      timeMinute: 0,
      timeHour: 0,
      isRunning: false,
    });
  };

  // Format time
  formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  // Log time to SharePoint list using PnPJS
  handleLog = async () => {
    const { timeHour, timeMinute, timeSecond } = this.state;
    const timeLogged = `${this.formatTime(timeHour)}:${this.formatTime(timeMinute)}:${this.formatTime(timeSecond)}`;

    try {
      const item = await this.sp.web.lists.getByTitle("stopWatch").items.add({
        Title: `Logged by ${this.props.userDisplayName}`,
        TimeLogged: timeLogged, // Assuming you have a `TimeLogged` column in your list
      });

      console.log("Time logged successfully:", item);
    } catch (error) {
      console.error("Error logging time:", error);
    }
  };

  ListLogs(){
    const {listTime} = this.state;
    if(listTime.length === 0){
      return <h3> No Previous Records</h3>
    }
    return (
      <ul>
        {listTime.map((time)=>(
          <li key={time.Id}>
            {time.TimeLogged}
          </li>
        ))}
      </ul>
    )
  }


  render(): React.ReactElement<IStopWatchProps> {
    const { environmentMessage, hasTeamsContext, userDisplayName } = this.props;
    const { timeSecond, timeMinute, timeHour, isRunning } = this.state;

    return (
      <section className={`${styles.stopWatch} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <h2>Good Day, {escape(userDisplayName)}!</h2>
          <div className={styles.timeBox}>
            {this.formatTime(timeHour)}:{this.formatTime(timeMinute)}:{this.formatTime(timeSecond)}
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={this.handleStartStop}>{isRunning ? 'STOP' : 'START'}</button>
            <button onClick={this.handleReset}>RESET</button>
            <button onClick={this.handleLog}>Log</button>
          </div>
        </div>
        <div>
        <h3>Logged Times</h3>
        {this.ListLogs()}
        </div>
        <div>{environmentMessage}</div>
      </section>
    );
  }
}
