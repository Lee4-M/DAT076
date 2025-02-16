import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Image from 'react-bootstrap/Image';
import { Container } from 'react-bootstrap';

export function HelpSettings () {
    return (
        <Container className="d-flex flex-column justify-content-end align-items-end vh-100 p-5">
            <ButtonGroup vertical>
                <Button variant='light' className='p-3'>
                <Image src="/images/question-mark.png" alt="Icon 1" width="40" height="40" />
                </Button>
                <Button variant='light' className='p-3'>
                <Image src="/images/settings.png" alt="Icon 1" width="40" height="40" />
                </Button>
            </ButtonGroup>
        </Container>
    )
}
