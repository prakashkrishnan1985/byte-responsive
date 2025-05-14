import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }
const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, color, ...other } = props;
    return <IconButton {...other} sx={{color: color}} />;
  })(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    variants: [
      {
        props: ({ expand }) => !expand,
        style: {
          transform: 'rotate(0deg)',
        },
      },
      {
        props: ({ expand }) => !!expand,
        style: {
          transform: 'rotate(180deg)',
        },
      },
    ],
  }));

  export default ExpandMore;