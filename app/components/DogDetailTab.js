import {
  Section,
  SectionCard,
  NonIdealState,
  Tag,
  Button,
} from '@blueprintjs/core';
import { DETAIL_CATEGORIES } from '../constants/constants';

const getRightElement = (num) => (
  <Tag intent="danger" round>
    {num}
  </Tag>
);

const Action = (
  <Button
    icon="add"
    text="Add something"
    minimal
    outlined
    small
    intent="none"
  />
);

// Components
import Tags from './Tag';

const DogDetailTab = (props) => {
  const { dog } = props;
  return (
    <div>
      {DETAIL_CATEGORIES.map((tab, index) => (
        <Section
          key={index}
          collapsible={true}
          title={tab}
          className="bp5-monospace-text"
          rightElement={
            dog['details'][tab.toLocaleLowerCase()].length == 0
              ? null
              : getRightElement(dog['details'][tab.toLocaleLowerCase()].length)
          }
        >
          <SectionCard padded={true}>
            {dog['details'][tab.toLocaleLowerCase()].length !== 0 ? (
              <div>
                <div>
                  {dog['details'][tab.toLowerCase()]
                    .filter((a) => a.priority === 'danger')
                    .map((alert, index) =>
                      alert ? <Tags key={index} alert={alert} /> : null
                    )}
                </div>
                <div>
                  {dog['details'][tab.toLowerCase()]
                    .filter((a) => a.priority === 'good')
                    .map((alert, index) =>
                      alert ? <Tags key={index} alert={alert} /> : null
                    )}
                </div>
                <div>
                  {dog['details'][tab.toLowerCase()]
                    .filter((a) => a.priority === 'info')
                    .map((alert, index) =>
                      alert ? <Tags key={index} alert={alert} /> : null
                    )}
                </div>
              </div>
            ) : (
              <NonIdealState title="Nothing to see here!" action={Action} />
            )}
          </SectionCard>
        </Section>
      ))}
    </div>
  );
};

export default DogDetailTab;
