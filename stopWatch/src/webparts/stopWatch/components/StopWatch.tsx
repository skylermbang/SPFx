/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import styles from './StopWatch.module.scss';
import type { IStopWatchProps } from './IStopWatchProps';
import { escape } from '@microsoft/sp-lodash-subset';

interface IStopWatchState {
  timeSecond: number;
  timeMinute: number;
  timeHour: number;
  isRunning: boolean;
}

export default class StopWatch extends React.Component<IStopWatchProps, IStopWatchState> {
  private timer: any = null;

  constructor(props: IStopWatchProps) {
    super(props);

    // Initialize state
    this.state = {
      timeSecond: 0,
      timeMinute: 0,
      timeHour: 0,
      isRunning: false,
    };
  }

  componentWillUnmount() {
    // Clear the timer when the component is unmounted
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // Start or stop the stopwatch
  handleStartStop = () => {
    if (this.state.isRunning) {
      // Stop the timer
      clearInterval(this.timer);
      this.timer = null;
    } else {
      // Start the timer
      this.timer = setInterval(() => {
        let { timeSecond, timeMinute, timeHour } = this.state;

        // Increment seconds
        timeSecond++;

        // Handle rollover for minutes and hours
        if (timeSecond === 60) {
          timeSecond = 0;
          timeMinute++;
        }
        if (timeMinute === 60) {
          timeMinute = 0;
          timeHour++;
        }

        // Update the state
        this.setState({ timeSecond, timeMinute, timeHour });
      }, 1000);
    }

    // Toggle the `isRunning` state
    this.setState({ isRunning: !this.state.isRunning });
  };

  // Reset the stopwatch
  handleReset = () => {
    // Clear the timer and reset the state
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

  // Format time to always display as two digits
  formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  handleLog = () => {
    const { timeHour, timeMinute, timeSecond } = this.state;
    console.log(`Logging time: ${timeHour}:${timeMinute}:${timeSecond}`);
  };
  
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
            <button onClick={this.handleLog}> Log</button>
          </div>
          <div>{environmentMessage}</div>
        </div>
      </section>
    );
  }
}
