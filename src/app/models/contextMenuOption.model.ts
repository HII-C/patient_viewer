/**
 * Represents a context menu option for use with 
 * `ContextMenuComponent`.
 */
export class ContextMenuOption {
    /**
     * Icon to display next to the option (from the 
     * Bootstrap Icons library).
     */
    icon: string;

    /**
     * Text to be displayed in the option.
     */
    text: string;

    /**
     * Function to be executed upon click of the option
     * in the context menu. 
     * 
     * @param data Data associated with the context menu.
     */
    exec: (data) => void;
}