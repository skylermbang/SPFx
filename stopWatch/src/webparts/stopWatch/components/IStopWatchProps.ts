
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IStopWatchProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext; // Add this line

}
