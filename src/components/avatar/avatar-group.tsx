/** use this component as a wrapper for Avatar components to create a group of avatars
 * */
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement
} from "react";
import {
  Avatar,
  AvatarProps
} from "@/components";

type AvatarGroupProps = {
  /** all children should be Avatar Component,it should have at least two children*/
  children: ReactElement<AvatarProps>[];
}

export const AvatarGroup = ({ children }: AvatarGroupProps) => {
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type !== Avatar) {
      throw new Error('Children of AvatarGroup must be Avatar components');
    }
  });

  return (
    <div className="flex items-center">
      { Children.map(children, (child, index) =>
        cloneElement(child, {
          className: `${index > 0 && '-ml-2'}`,
        })
      ) }
    </div>
  );
}
