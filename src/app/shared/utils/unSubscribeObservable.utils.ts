import { Subscription } from 'rxjs';

export function unsubscribeAll(...subscriptions: Subscription[]): void {
  subscriptions.forEach((subscription) => {
    if (subscription && !subscription.closed) {
      subscription.unsubscribe();
    }
  });
}
